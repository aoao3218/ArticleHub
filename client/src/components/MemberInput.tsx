import { useContext } from 'react';
import { EmailsCtx } from '../context/EmailCtx';

const MemberInput = () => {
  const { emails, setEmails } = useContext(EmailsCtx);

  const handleEmailChange = (index: number, value: string) => {
    const updatedEmails = [...emails];
    updatedEmails[index] = value;
    setEmails(updatedEmails);
  };

  const handleAddEmail = () => {
    setEmails([...emails, '']);
  };

  const handleRemoveEmail = (index: number) => {
    const updatedEmails = [...emails];
    updatedEmails.splice(index, 1);
    setEmails(updatedEmails);
  };
  return (
    <div>
      {emails.map((email, index) => (
        <div key={index} className="row">
          <input
            type="email"
            value={email}
            onChange={(e) => handleEmailChange(index, e.target.value)}
            placeholder="Email"
            style={{ width: '100%' }}
          />
          {index > 0 && (
            <p onClick={() => handleRemoveEmail(index)} style={{ margin: 'auto 8px' }}>
              X
            </p>
          )}
        </div>
      ))}
      <p onClick={handleAddEmail} style={{ textAlign: 'center', cursor: 'pointer' }}>
        Add Member
      </p>
    </div>
  );
};

export default MemberInput;
