# Joy.Api Dockerfile
# Build context should be: backend/src/
# Docker compose should reference: ../devops/ for configs

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 5000
EXPOSE 5001

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy solution file
COPY ["Joy.sln", "./"]

# Copy all project files
COPY ["Joy.Api/Joy.Api.csproj", "Joy.Api/"]
COPY ["Joy.Modules.Shared/Joy.Modules.Shared.csproj", "Joy.Modules.Shared/"]
COPY ["Joy.Modules.Gifts/Joy.Modules.Gifts.csproj", "Joy.Modules.Gifts/"]
COPY ["Joy.Modules.Messages/Joy.Modules.Messages.csproj", "Joy.Modules.Messages/"]
COPY ["Joy.Modules.Friends/Joy.Modules.Friends.csproj", "Joy.Modules.Friends/"]
COPY ["Joy.Modules.AI/Joy.Modules.AI.csproj", "Joy.Modules.AI/"]
COPY ["Joy.Modules.Communication/Joy.Modules.Communication.csproj", "Joy.Modules.Communication/"]

# Restore dependencies
RUN dotnet restore "Joy.Api/Joy.Api.csproj"

# Copy all source code
COPY . .

# Build the application
WORKDIR "/src/Joy.Api"
RUN dotnet build "Joy.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Joy.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Set environment variables
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Development

ENTRYPOINT ["dotnet", "Joy.Api.dll"]
