import buildClient from '../api/build-client'

const LandingPage = ({ currentUser }) => {
  console.log(currentUser)

  return currentUser ? (
    <h1>You're signed in</h1>
  ) : (<h1>You are NOT signed in</h1>)
}

LandingPage.getInitialProps = async (ctx) => {
  const client = buildClient(ctx);

  const { data } = await client.get('/api/users/currentuser');
  
  return data;
} 

export default LandingPage;
