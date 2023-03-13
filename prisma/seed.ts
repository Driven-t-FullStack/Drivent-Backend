import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { truncate } from "fs/promises";
const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: "Driven.t",
        logoImageUrl: "https://files.driveneducation.com.br/images/logo-rounded.png",
        backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, "days").toDate(),
      },
    });
  }

  await prisma.ticketType.createMany({
    data: [
      { name: "Presencial + Sem Hotel", price: 250, isRemote: false, includesHotel: false },
      { name: "Presencial + Com hotel", price: 600, isRemote: false, includesHotel: true },
      { name: "Online", price: 100, isRemote: true, includesHotel: false },
    ],
  });

  await prisma.hotel.create({
    data: {
      name: "Driven Palace",
      image:
        "https://www.google.com/imgres?imgurl=https%3A%2F%2Fwww.luxurylink.com%2Fimages%2Fsho_600b47e9%2F1252_601-630%2Fimage-1252_601.jpg&imgrefurl=http%3A%2F%2Fwww.luxurylink.com%2F5star%2Fhotel-deals%2Farizona&tbnid=MolJc088V2VioM&vet=12ahUKEwjZmuiAkdD9AhUnNLkGHfLCAkcQMygEegUIARDDAQ..i&docid=0A3WGpxY1m5NIM&w=630&h=379&q=fancy%20hotels&ved=2ahUKEwjZmuiAkdD9AhUnNLkGHfLCAkcQMygEegUIARDDAQ",
      type: "Single, Double e Triple",
      Rooms: {
        create: [
          { name: "01", capacity: 3 },
          { name: "02", capacity: 2 },
          { name: "03", capacity: 1 },
          { name: "04", capacity: 3 },
          { name: "05", capacity: 3 },
          { name: "06", capacity: 2 },
          { name: "07", capacity: 3 },
        ],
      },
    },
  });

  await prisma.hotel.create({
    data: {
      name: "Driven Resort",
      image:
        "https://www.google.com/imgres?imgurl=https%3A%2F%2Fsecure.s.forbestravelguide.com%2Fimg%2Fproperties%2Fthe-maybourne-beverly-hills%2Fthe-maybourne-beverly-hills-exterior.jpg&imgrefurl=https%3A%2F%2Fwww.forbestravelguide.com%2Fdestinations%2Flos-angeles-california&tbnid=f-YcDsIjPM2cBM&vet=12ahUKEwjZmuiAkdD9AhUnNLkGHfLCAkcQMygOegUIARDZAQ..i&docid=t1QvwR5IsXg2pM&w=760&h=425&q=fancy%20hotels&ved=2ahUKEwjZmuiAkdD9AhUnNLkGHfLCAkcQMygOegUIARDZAQ",
      type: "Single e Double",
      Rooms: {
        create: [
          { name: "01", capacity: 1 },
          { name: "02", capacity: 1 },
          { name: "03", capacity: 1 },
          { name: "04", capacity: 2 },
          { name: "05", capacity: 2 },
        ],
      },
    },
  });
  await prisma.hotel.create({
    data: {
      name: "Driven World",
      image:
        "https://www.google.com/imgres?imgurl=https%3A%2F%2Fimgix.theurbanlist.com%2Fcontent%2Farticle%2Fmelbourne-best-hotels-the-chen.jpg&imgrefurl=https%3A%2F%2Fwww.theurbanlist.com%2Fmelbourne%2Fa-list%2Fbest-hotels-melbourne&tbnid=doYjEXfvJqgF0M&vet=12ahUKEwjZmuiAkdD9AhUnNLkGHfLCAkcQMyghegUIARCEAg..i&docid=SnRrhk8g0P-_LM&w=740&h=487&q=fancy%20hotels&ved=2ahUKEwjZmuiAkdD9AhUnNLkGHfLCAkcQMyghegUIARCEAg",
      type: "Single e Double",
      Rooms: {
        create: [
          { name: "01", capacity: 2 },
          { name: "02", capacity: 2 },
          { name: "03", capacity: 1 },
          { name: "04", capacity: 2 },
          { name: "05", capacity: 2 },
          { name: "06", capacity: 1 },
        ],
      },
    },
  });
  console.log({ event });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
