import { Group } from "../src/generated/prisma-client/index";

async function getGroups(mysql : any) : Promise<Array<object>> {
  console.log("querying data");
  const data = await mysql.query(
    `
    SELECT eg.guid as guid, eg.name as name, ee.access_id FROM elgggroups_entity eg
    JOIN elggentities ee ON ee.guid = eg.guid
    WHERE ee.access_id IN (1,2)
    `, {}
  ).catch(
    (err) => {
      console.log(err);
    }
  );
  return data;
}

async function getMembers(mysql : any, guid : any) : Promise<Array<object>> {
  //console.log("querying data");
  const data = await mysql.query(
    `
    SELECT guid_one as user FROM elggentity_relationships
    WHERE relationship = "member" AND guid_two = ${guid}
    `, {}
  ).catch(
    (err) => {
      console.log(err);
    }
  );
  return data;
}

async function seedGroups(prisma : any, mysql :any) : Promise<void> {
  let groups : any = await getGroups(mysql);
  let progress = 0;
  for (var i = 0; i < groups.length; i++) {
    let groupCheck : Group[] = await prisma.groups({where:{guid:groups[i].guid}});
    if (groupCheck.length == 0) {

      let newgroup : Group = await prisma.createGroup({
        guid: groups[i].guid,
        isPublic: (groups[i]["access_id"] == 1 || groups[i]["access_id"] == 2) ? true : false,
        name: JSON.parse(groups[i]["name"])["en"],
      });

      let membersdata = await getMembers(mysql, newgroup.guid);
      let members = [];
      for (var i = 0; i < membersdata.length; i++) {
        members.push(membersdata[i]["user"]);
      }
      
      for (var i = 0; i < members.length; i++) {
        try {
          await prisma.updateGroup({
            where: {guid: newgroup.guid},
            data: {
              members: {
                connect: {
                  guid: members[i]
                }
              }
            }
          })
        } catch(e) {
          console.log(e);
        }
        
      }
    }
    if ( parseInt((i / groups.length * 100).toString()) > progress ) {
      progress++;
      console.log(i, "--", progress + "%");
    }
  }
  mysql.close();
  console.log("Done seeding groups");
}

export default seedGroups;