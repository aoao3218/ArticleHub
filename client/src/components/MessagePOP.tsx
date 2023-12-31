interface MsgProps {
  msg: string;
  onClose: () => void;
}

const MessagePOP: React.FC<MsgProps> = ({ msg, onClose }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '32px',
        transform: 'translateX(-50%)',
        margin: '20px auto',
        alignContent: 'center',
      }}
    >
      <p className="msg">
        {msg}
        <span style={{ marginLeft: '8px', cursor: 'pointer' }} onClick={handleClose}>
          &times;
        </span>
      </p>
    </div>
  );
};

export default MessagePOP;
