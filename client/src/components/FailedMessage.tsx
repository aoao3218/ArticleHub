interface mgs {
  mgs: string;
}

const FailedMessage = ({ mgs }: mgs) => {
  return <p style={{ textAlign: 'center', color: '#ED3920' }}>{mgs}</p>;
};

export default FailedMessage;
