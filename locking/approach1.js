const { sql } = require("./db")

console.time("experiment");
// the bookings does NOT COMPLETE for all seats
const bookSeatByUserId = async (userId, username) => {
    try {
        // begin transaction
        await sql.begin(async sql => {

            const getAvailableSeat = await sql`select id, userId from seats 
                                     where userId is null
                                     order by id limit 1 for update skip locked`

            if (getAvailableSeat.length === 0) {
                return "err"
            }

            const userbooking = await sql`update seats set userid = ${userId}, username=${username} 
                                            where seats.id = ${getAvailableSeat[0].id}  returning *`
            if (userbooking[0]) {
                console.log("booking", userbooking[0].id, " for user ", userbooking[0].username)
            } else {
                console.log("userbooking failed", userbooking)
            }
        })
    } catch (err) {
        console.log("err on bookseatbyuserId", err)
    }
}

const bookSeats = async () => {
    // cleanup before next start
    await sql`update seats set userid=null, username=null where userid is not null`

    try {
        const users = await sql`select id, name from users`
        const Promises = []
        users.map((user, idx, len) => {
            Promises.push(bookSeatByUserId(user.id, user.name))
        })
        Promise.allSettled(Promises).finally(() => {
            console.timeEnd("experiment");
            getTotal()
        })
    }
    catch (err) {
        console.log("bookseats err", err.name, err.message)
    }
}

const getTotal = async () => {
    const total = await sql`select count(userid) from seats`
    console.log("Total Bookings done: ", total[0].count)
}

bookSeats()
