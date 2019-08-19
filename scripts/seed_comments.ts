import cleanString from "./clean_string";

async function getComments(mysql :any) : Promise<Array<object>> {
  console.log("querying data");
  const data = await mysql.query(
    `
    SELECT 
      from_unixtime(ee.time_created) as createdAtElgg, 
      ee.guid as guid, ee.owner_guid as owner, 
      ee.container_guid as container,
      oe.description
    FROM elggentities ee
    JOIN (SELECT * FROM elggentities WHERE subtype = 20) ee2 ON ee2.guid = ee.container_guid
    JOIN elggobjects_entity oe ON oe.guid = ee.guid
    WHERE ee.subtype = 7
    `, {}
  ).catch(
    (err) => {
      console.log(err);
    }
  );
  return data;
}

async function seedComments(prisma : any, mysql :any) : Promise<void> {
  let comments : any = await getComments(mysql);
  
  for (var i = 0; i < comments.length; i++) {
    let commentCheck = await prisma.comments({where:{guid:comments[i].guid}});
    if (commentCheck.length == 0) {
      try {
        let data = {
          guid: comments[i]["guid"],
          author: {
            connect: {
              guid: comments[i]["owner"]
            }
          },
          content: cleanString(comments[i]['description'])
        }
        if ((await prisma.comments({where:{guid:comments[i]["container"]}})).length > 0 ) {
          data["parentComment"] = {
            connect: {
              guid: comments[i]["container"]
            }
          }
        }
        await prisma.createComment(data);
      } catch(e) {
        console.log("no group or private");
      }
    }
    console.log(i);
  }

  console.log("Done seeding discussion comments");
}

export default seedComments;