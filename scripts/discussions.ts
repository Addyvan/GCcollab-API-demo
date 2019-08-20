import cleanString from "./clean_string";

async function getDiscussions(mysql :any) : Promise<Array<object>> {
  console.log("querying data");
  const data = await mysql.query(
    `
    SELECT ee.access_id as access_id, ee.guid as guid, ee.owner_guid as owner, ee.container_guid as container,  oe.title as title, oe.description as description, from_unixtime(ee.time_created) as createdAtElgg FROM elggentities ee
    JOIN elggobjects_entity oe ON oe.guid = ee.guid
    WHERE ee.subtype = 20
    `, {}
  ).catch(
    (err) => {
      console.log(err);
    }
  );
  return data;
}

async function seedDiscussions(prisma : any, mysql :any) : Promise<void> {
  let discussions : any = await getDiscussions(mysql);
  let progress = 0;
  for (var i = 0; i < discussions.length; i++) {
    let discussionCheck = await prisma.discussions({where:{guid:discussions[i].guid}});
    if (discussionCheck.length == 0) {
      try {
        await prisma.createDiscussion({
          guid: discussions[i]["guid"], 
          author: {
            connect: {
              guid: discussions[i]["owner"]
            }
          },
          group: {
            connect: {
              guid: discussions[i]["container"]
            }
          },
          content: cleanString(discussions[i]['description']),
          title: discussions[i]['title'] 
        });
      } catch(e) {
        console.log("no group or private");
      }
    }
    if ( parseInt((i / discussions.length * 100).toString()) > progress ) {
      progress++;
      console.log(progress + "%");
    }
  }

  console.log("Done seeding discussions");
}

export default seedDiscussions;