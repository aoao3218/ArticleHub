import { useState, useEffect } from 'react';

interface CreateProps {
  teamId?: string;
  onClose: () => void;
}

interface Member {
  _id: string;
  email: string;
}

const MemberList: React.FC<CreateProps> = ({ teamId, onClose }) => {
  const jwt = localStorage.getItem('jwt');
  const [members, setMembers] = useState<Member[] | []>([]);
  const domain = window.location.host;
  const protocol = window.location.protocol;

  useEffect(() => {
    fetch(`${protocol}//${domain}/api/team/member/${teamId}`, {
      headers: new Headers({
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setMembers(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="popup_bg">
      <div className="popup" style={{ width: '200px' }}>
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '0px auto 16px auto', alignContent: 'center' }}>
          Members
        </p>
        {members.length > 1 ? (
          members.map((obj) => <div style={{ margin: '4px 0px' }}>{obj.email}</div>)
        ) : (
          <div style={{ textAlign: 'center' }}>no member</div>
        )}
      </div>
    </div>
  );
};

export default MemberList;
