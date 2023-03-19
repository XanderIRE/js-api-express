# js-api-express

## Summary

## Setup

- Install psql [here](https://www.postgresql.org/download/)

- Install repo dependencies:

```cli
npm install -d
```

- Create file **.env.development** with this command:

```
echo "PGDATABASE=mitchs_rare_treasures" > .env.development
```

- Create file **.env.test** with this command:

```
echo "PGDATABASE=mitchs_rare_treasures_test" > .env.development
```

- Create the *development* and *test* databases with this command:

```cli
npm run setup-dbs
```

- Seed the *development* database with this command:

```cli
npm run seed
```

- Run unit tests using `jest` with this command:

```cli
npm test
```