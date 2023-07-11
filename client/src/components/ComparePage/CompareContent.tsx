import Text from './Text';
import TextMain from './TextMain';
import { useParams } from 'react-router-dom';

interface props {
  update: number;
}

const CompareContent = ({ update }: props) => {
  const { branch } = useParams();
  return (
    <div className="row" style={{ width: '100%' }}>
      <Text branch={branch} update={update} />
      <TextMain branch={branch} update={update} />
    </div>
  );
};

export default CompareContent;
