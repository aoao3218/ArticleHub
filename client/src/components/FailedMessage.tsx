interface mgs {
  mgs: string;
}

const FailedMessage = ({ mgs }: mgs) => {
  return <p style={{ textAlign: 'center' }}>{mgs}</p>;
};

export default FailedMessage;
