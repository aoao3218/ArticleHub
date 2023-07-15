import '../App.css';
import Header from '../components/Header';

const NotFounds = () => {
  return (
    <div>
      <Header />
      <div className="content">
        <div style={{ textAlign: 'center' }}>
          <h1>Oops!</h1>
          <p>Sorry, an unexpected error has occurred.</p>
        </div>
      </div>
    </div>
  );
};

export default NotFounds;
