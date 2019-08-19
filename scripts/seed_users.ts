
async function getUsers(mysql : any) : Promise<Array<object>> {
  console.log("querying data");
  const data = await mysql.query(
    `
    SELECT ue.guid as guid, ue.email as email FROM elggusers_entity ue
    `, {}
  ).catch(
    (err) => {
      console.log(err);
    }
  );
  mysql.close();
  return data;
}


async function seedUsers(prisma : any, mysql : any) : Promise<void> {
  let users : any = await getUsers(mysql);
  let progress = 0;
  for (var i = 0; i < users.length; i++) {
    let userCheck = await prisma.users({where:{guid:users[i].guid}});
    if (userCheck.length == 0) {
      await prisma.createUser({
        guid: users[i].guid,
        email: users[i].email
      });
    }
    if ( parseInt((i / users.length * 100).toString()) > progress ) {
      progress++;
      console.log(progress + "%");
    }
  }

  
}

export default seedUsers;