import * as mysql from 'mysql';

require("dotenv").config();


/** Class containing MySQL connection along with asynchronous wrapper functions for making SQL queries 
 * Without the wrapper functions (Promises), munging operations inside async/await functions will not work. 
 */
class MySQLConnector {

  private connection : any;

  constructor() {
    const env = process.env;
    var creds = {};
    
    creds = {
      host: env.COLLAB_DB_HOST,
      user: env.COLLAB_DB_USER,
      password: env.COLLAB_DB_PASSWORD,
      database: env.COLLAB_DB_NAME,
      port: env.COLLAB_DB_PORT,
      multipleStatements: true
    };

    try {
      this.connection = mysql.createConnection(
        creds
      );
    } 
    catch(err) {
      console.log("creds:");
      console.log(creds);
      console.log(err);
    }
    
  }

  /**
   * Query the MySQL database.
   * @return {Promise} The Promise object containing the result of the query.
   */
  public query( sql, args ) : Promise<any> {
    return new Promise( ( resolve, reject ) => {
      this.connection.query( sql, args, ( err, rows ) => {
        if ( err ) {
          console.log(err);
          return reject( err );
        }
          resolve( rows );
      });
    });
  }

  /** Close the connection with the MySQL database.*/
  public close() : Promise<any> {
    return new Promise( ( resolve, reject ) => {
      this.connection.end( err => {
        if ( err )
          return reject( err );
        resolve();
      });
    });
  }

}

export default MySQLConnector;