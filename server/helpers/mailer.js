import 'babel-polyfill';
import sendgrid from '@sendgrid/mail';

const from = 'sendit.parcel.delivery@gmail.com';

const mailer = async ({ subject, html, to }) => {
  sendgrid.setApiKey(process.env.SENDGRID);
  const msg = {
    to, from, subject, html,
  };
  try {
    await sendgrid.send(msg);
  } catch (error) {
    console.log(error);
  }
};

export default mailer;
