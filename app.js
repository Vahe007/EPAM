import {faker} from "@faker-js/faker"
import loadash from "lodash"

const arr = []
console.log("The collection of unsorted users")
for (let i = 0; i < 10; i++) {
    const obj = {
        name: faker.internet.userName(),
        email: faker.internet.email(),
        phone: faker.phone.number()
    }
    console.log(obj)
    arr.push(obj)
}
console.log("\n")

console.log("The collection of sorted users")
const sortedArr = loadash.sortBy(arr, "name")

for (let i = 0; i < arr.length; i++) {
    console.log(sortedArr[i])
}
console.log()
