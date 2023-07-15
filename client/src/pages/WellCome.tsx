import { useNavigate } from 'react-router-dom';

const WellCome = () => {
  const jwt = localStorage.getItem('jwt');
  const navigate = useNavigate();

  const start = () => {
    if (jwt) {
      navigate('/profile');
    } else {
      navigate('/account');
    }
  };

  return (
    <div className="content home" style={{ height: 'calc(100% - 61px)' }}>
      <h1 style={{ fontSize: '68px' }}>
        How do you <strong style={{ color: '#edb320' }}>control</strong> ,
        <strong style={{ color: '#edb320' }}> align</strong>
        <br /> and <strong> manage</strong> articles with other people?
      </h1>
      <h1 style={{ fontSize: '68px', margin: '0 0 45px 0' }}>
        Do it to gether with <span style={{ color: '#edb320' }}>ArticleHub</span>
      </h1>
      <div>
        <button className="btn_home" onClick={start}>
          GET START
        </button>
      </div>
    </div>
  );
};

export default WellCome;
