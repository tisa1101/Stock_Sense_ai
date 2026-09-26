# Multi-stage Dockerfile for StockSense .NET 8 API
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY StockSense.Domain/StockSense.Domain.csproj StockSense.Domain/
COPY StockSense.Application/StockSense.Application.csproj StockSense.Application/
COPY StockSense.Infrastructure/StockSense.Infrastructure.csproj StockSense.Infrastructure/
COPY StockSense.API/StockSense.API.csproj StockSense.API/

RUN dotnet restore StockSense.API/StockSense.API.csproj

# Copy the entire backend source code
COPY . .

# Build and publish release output
WORKDIR /src/StockSense.API
RUN dotnet publish StockSense.API.csproj -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Install font libraries for QuestPDF rendering
RUN apt-get update && apt-get install -y --no-install-recommends \
    libfontconfig1 \
    libfreetype6 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000

ENTRYPOINT ["dotnet", "StockSense.API.dll"]
