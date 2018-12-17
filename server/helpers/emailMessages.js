/**
 * class for email messages
 */
class Messages {
  /**
   * @param {String} mailMessage for email body
   * @returns {String} full html for email
   */
  static messageHTML(mailMessage) {
    return `<div style="font-family: 'Arial';">
      <header style="background: #90f; padding: 5px;"><h1 style="color: white; margin-bottom:0;">SendIT</h1><small style="color: white; margin-top:0;"><i>...delivering on time, all the time.</i></small></header>
      <section style="font-size: 13px; background-color: white; padding: 10px; margin: 20px auto; border: 1px solid #90f;"> 
      ${mailMessage}
      </section>
      </div>`;
  }

  /**
   * @param {number} id ID of the parcel
   * @param {string} name Name of the user
   * @param {String} status parcel status
   * @returns an object
   */
  static status(id, name, status) {
    const message = `<p>Hello ${name}, <br> Your parcel with ID <b>'${id}'</b> ${status === 'delivered' ? 'has been delivered' : 'is now in transit'}.</p>`;
    return {
      subject: 'Update on your parcel delivery order',
      html: Messages.messageHTML(message),
    };
  }

  /**
   * @description Email content for updates on present location
   * @static
   * @param {string} location Present location of the parcel
   * @param {number} id ID of the parcel
   * @param {string} name name of the user
   * @returns an object
   */
  static location(location, id, name) {
    const message = `<p>Hello ${name},<br> Your parcel with ID <b>'${id}'</b> just arrived at <b>${location}.</b></p>`;
    return {
      subject: 'Update on your parcel delivery order',
      html: Messages.messageHTML(message),
    };
  }
}

export default Messages;
