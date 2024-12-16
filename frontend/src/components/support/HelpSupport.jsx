import { Link } from "react-router-dom";
function HelpSupport() {
  return (
    <div className="container-fluid p-5">
      <h4>Settings</h4>
      <ul className="list-group">
        <li className="list-group-item ">
          <Link to='' className='text-decoration-none text-dark'>Language Preferences</Link>
        </li>
        <li className="list-group-item mb-3">
          <Link to='' className='text-decoration-none text-dark'>Notification Preferences</Link>
        </li>
      </ul>
    </div>
  );
};
export default HelpSupport;