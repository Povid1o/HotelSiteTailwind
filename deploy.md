# Deploy instructions
```
git clone git@github.com:Povid1o/HotelSiteTailwind.git
cd ~/HotelSiteTailwind
docker-compose up --build -d
```
## migrations
if you need to migrate:
```
docker-compose exec backend npx sequelize-cli db:migrate
docker-compose exec db psql -U postgres -d HotelSite -c "SELECT id, name FROM rooms;"
```
if not work try after this:
```
docker-compose down
docker-compose up --build -d
```
