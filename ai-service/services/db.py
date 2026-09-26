import os
import pyodbc
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "DRIVER={ODBC Driver 18 for SQL Server};SERVER=sqlserver,1433;DATABASE=StockSenseDb;UID=sa;PWD=YourStrong@Passw0rd!;TrustServerCertificate=yes"
)

def get_connection():
    db_url = os.getenv("DATABASE_URL")
    if db_url:
        try:
            return pyodbc.connect(db_url)
        except Exception as e:
            # If specified driver failed, try swapping between Driver 18 and 17
            if "ODBC Driver 18" in db_url:
                try:
                    return pyodbc.connect(db_url.replace("ODBC Driver 18", "ODBC Driver 17"))
                except Exception:
                    pass
            elif "ODBC Driver 17" in db_url:
                try:
                    return pyodbc.connect(db_url.replace("ODBC Driver 17", "ODBC Driver 18"))
                except Exception:
                    pass

    # Fallback to local / environment connection strings
    for driver in ["ODBC Driver 18 for SQL Server", "ODBC Driver 17 for SQL Server", "SQL Server"]:
        for host in ["sqlserver,1433", "(localdb)\\mssqllocaldb", "localhost,1433"]:
            try:
                conn_str = f"DRIVER={{{driver}}};SERVER={host};DATABASE=StockSenseDb;UID=sa;PWD=YourStrong@Passw0rd!;TrustServerCertificate=yes;"
                return pyodbc.connect(conn_str, timeout=3)
            except Exception:
                pass
            try:
                conn_str = f"DRIVER={{{driver}}};SERVER={host};DATABASE=StockSenseDb;Trusted_Connection=yes;TrustServerCertificate=yes;"
                return pyodbc.connect(conn_str, timeout=3)
            except Exception:
                pass

    return None

def get_ledger_for_product(product_id: int, days: int = 90):
    conn = get_connection()
    if not conn:
        return pd.DataFrame()
    query = f"""
        SELECT Id, ProductId, WarehouseId, TransactionType, ReferenceId, 
               QuantityBefore, QuantityChange, QuantityAfter, Description, CreatedAt, CreatedBy
        FROM StockLedgers
        WHERE ProductId = ? AND CreatedAt >= DATEADD(day, -?, GETDATE())
        ORDER BY CreatedAt ASC
    """
    try:
        df = pd.read_sql(query, conn, params=(product_id, days))
        return df
    except Exception as e:
        print(f"Error fetching ledger: {e}")
        return pd.DataFrame()
    finally:
        conn.close()

def get_all_recent_ledger(days: int = 30):
    conn = get_connection()
    if not conn:
        return pd.DataFrame()
    query = f"""
        SELECT Id, ProductId, WarehouseId, TransactionType, ReferenceId, 
               QuantityBefore, QuantityChange, QuantityAfter, Description, CreatedAt, CreatedBy
        FROM StockLedgers
        WHERE CreatedAt >= DATEADD(day, -?, GETDATE())
        ORDER BY CreatedAt ASC
    """
    try:
        df = pd.read_sql(query, conn, params=(days,))
        return df
    except Exception as e:
        print(f"Error fetching recent ledger: {e}")
        return pd.DataFrame()
    finally:
        conn.close()

def get_products():
    conn = get_connection()
    if not conn:
        return pd.DataFrame()
    query = "SELECT Id, Name, SKU, CategoryId, ReorderLevel, IsActive FROM Products"
    try:
        df = pd.read_sql(query, conn)
        return df
    except Exception as e:
        print(f"Error fetching products: {e}")
        return pd.DataFrame()
    finally:
        conn.close()

def get_product_by_id(product_id: int):
    conn = get_connection()
    if not conn:
        return None
    cursor = conn.cursor()
    query = "SELECT Id, Name, SKU, CategoryId, ReorderLevel, IsActive FROM Products WHERE Id = ?"
    try:
        cursor.execute(query, (product_id,))
        row = cursor.fetchone()
        if row:
            columns = [column[0] for column in cursor.description]
            return dict(zip(columns, row))
        return None
    except Exception as e:
        print(f"Error fetching product: {e}")
        return None
    finally:
        conn.close()

def get_dashboard_context():
    conn = get_connection()
    if not conn:
        return {}
    
    context = {}
    try:
        # Total products
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM Products WHERE IsActive = 1")
        context['total_products'] = cursor.fetchone()[0]
        
        # Total stock
        cursor.execute("SELECT SUM(Quantity) FROM Inventories")
        stock_result = cursor.fetchone()[0]
        context['total_stock'] = stock_result if stock_result else 0
        
        # Low stock items
        query_low_stock = """
            SELECT p.Name, p.SKU, SUM(i.Quantity) as TotalQuantity, p.ReorderLevel
            FROM Products p
            LEFT JOIN Inventories i ON p.Id = i.ProductId
            WHERE p.IsActive = 1
            GROUP BY p.Id, p.Name, p.SKU, p.ReorderLevel
            HAVING SUM(i.Quantity) <= p.ReorderLevel
        """
        cursor.execute(query_low_stock)
        low_stock_items = []
        columns = [column[0] for column in cursor.description]
        for row in cursor.fetchall():
            low_stock_items.append(dict(zip(columns, row)))
        context['low_stock_items'] = low_stock_items
        
        # Recent ledger
        query_recent = """
            SELECT TOP 10 TransactionType, QuantityChange, CreatedAt 
            FROM StockLedgers 
            ORDER BY CreatedAt DESC
        """
        cursor.execute(query_recent)
        recent_ledger = []
        columns = [column[0] for column in cursor.description]
        for row in cursor.fetchall():
            row_dict = dict(zip(columns, row))
            row_dict['CreatedAt'] = str(row_dict['CreatedAt'])
            recent_ledger.append(row_dict)
        context['recent_ledger'] = recent_ledger
        
        return context
    except Exception as e:
        print(f"Error fetching dashboard context: {e}")
        return {}
    finally:
        conn.close()
