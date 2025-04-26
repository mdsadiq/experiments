const { faker } = require('@faker-js/faker');


const setupData = async () => {
    await sql`CREATE TABLE users (id int, name  varchar(255))`
    await sql`CREATE TABLE airline (id int , name  varchar(255), primary key (id))`
    await sql`CREATE TABLE seats (id int , username  varchar(255), userId int null,	 primary key (id))`

    for (var i = 0; i < 120; i++) {
        const users = await sql` insert into users (id, name ) values (${i + 1}, ${faker.person.fullName()} ) returning *`
        console.log(users)
    }
    for (var j = 0; j < 120; j++) {
        const seats = await sql` insert into seats (id, username, userId ) values (${j + 1}, null, null ) returning *`
        console.log(seats)
    }
    const airline = await sql`insert into airline (id, name) values (1, 'indigo')`

}
setupData();
