FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["ClaimsService.csproj", "./"]
RUN dotnet restore "ClaimsService.csproj"
COPY . .
RUN dotnet build "ClaimsService.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ClaimsService.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ClaimsService.dll"]
