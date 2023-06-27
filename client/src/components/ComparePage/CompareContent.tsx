import Text from './Text';
import { useParams } from 'react-router-dom';

const CompareContent = () => {
  const { branch } = useParams();
  return (
    <div className="row" style={{ width: '100%' }}>
      <Text branch={branch} />
      <Text branch={'main'} />
    </div>
  );
};

export default CompareContent;
