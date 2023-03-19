# js-api-express

## Summary

## Setup

- Install psql [here](https://www.postgresql.org/download/)

- Install repo dependencies:

```cli
npm install -d
```

- Create file **.env.develoment** and write to it:

```
PGDATABASE=rare_treasures
```

- Create file **.env.test** and write to it:

```
PGDATABASE=rare_treasures_test
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