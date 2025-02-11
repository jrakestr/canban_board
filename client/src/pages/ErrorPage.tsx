import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <section>
      <h1>404: Page Not Found</h1>
      <h1> ¯\_(ツ)_/¯</h1>
      <Link to="/" style={{ textDecoration: 'underline', color: 'blue', marginTop: '20px', display: 'block' }}>
        Return to Home
      </Link>
    </section>
  );
};

export default ErrorPage;
