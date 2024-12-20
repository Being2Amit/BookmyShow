import Foot from "./Foot";
import { RiCustomerService2Line } from "react-icons/ri";
import { ImPagebreak, ImTicket } from "react-icons/im";
import { SlEnvolopeLetter } from "react-icons/sl";
import { Link } from "react-router-dom";
function Footer() {
  return (
    <>
      <footer>
        <div className="w-full" style={{ backgroundColor: '#333338' }}>

          <div style={{ backgroundColor: '#404043' }}>
            <div className="mx-auto w-11/12 md:w-3/4">
              {/* Services */}
              <div className="flex justify-evenly gap-x-52 p-3">

                {/* customer care */}
                <a to="#" className="flex flex-col items-center text-decoration-none text-light w-20">
                  <RiCustomerService2Line style={{ fontSize: '40px',color:'lightgray' }}/>
                  <div className="text-center text-xs mt-3 whitespace-nowrap">24/7 CUSTOMER CARE</div>
                </a>
                {/* resend ticket  */}
                <a to="#" className="flex flex-col items-center text-decoration-none text-light w-20">
                  <ImTicket  style={{ fontSize: '40px',color:'lightgray'}}/>
                  <div className="text-center text-xs mt-3 whitespace-nowrap">RESEND BOOKING CONFIRMATION</div>
                </a>

                {/* News Letter */}
                <a to="#" className="flex flex-col items-center text-decoration-none text-light w-20">
                  <SlEnvolopeLetter  style={{ fontSize: '40px',color:'lightgray', fontWeight: '100'}}/>
                  <div className="text-center text-xs mt-3 whitespace-nowrap">SUBSCRIBE TO THE NEWSLETTER</div>
                </a>
              </div>
            </div>
          </div>

          <div className="w-full py-2 text-text-light" >
            <div className="mx-auto px-3.5" style={{ width: '1200px' }} >

              {/* movie-list-1 */}
              <div className="mb-3" >
                <div className="mb-2 font-bold font-sans" style={{ color: '#A5A5A5', fontSize: '12px' }} >MOVIES NOW SHOWING IN HYDERADAD</div>
                <div className="anchors-con ">
                  <Link to="/movies/1239511" className="mb-1 mr-1 pr-1 text-decoration-none" style={{color: '#A5A5A5', borderRight: '1px solid rgb(127, 127, 127)' }} >Lucky Baskhar</Link>
                  <Link to="/movies/927342" className="mb-1 mr-1 pr-1 text-decoration-none" style={{color: '#A5A5A5', borderRight: '1px solid rgb(127, 127, 127)' }} >Amaran</Link>
                  <Link to="/movies/1353436" className="mb-1 mr-1 pr-1 text-decoration-none" style={{color: '#A5A5A5', borderRight: '1px solid rgb(127, 127, 127)' }} >KA (2024)</Link>
                  <Link to="/movies/980599" className="mb-1 mr-1 pr-1 text-decoration-none" style={{color: '#A5A5A5', borderRight: '1px solid rgb(127, 127, 127)' }} >Bhool Bhulaiyaa 3</Link>
                  <Link to="/movies/912649" className="mb-1 mr-1 pr-1 text-decoration-none" style={{color: '#A5A5A5', borderRight: '1px solid rgb(127, 127, 127)' }} >Venom: The Last Dance</Link>
                  <Link to="/movies/1014214" className="mb-1 mr-1 pr-1 text-decoration-none" style={{color: '#A5A5A5', borderRight: '1px solid rgb(127, 127, 127)' }} >Singham Again</Link>
                  <Link to="/movies/777292" className="mb-1 mr-1 pr-1 text-decoration-none" style={{color: '#A5A5A5', borderRight: '1px solid rgb(127, 127, 127)' }} >Bagheera</Link>
                  <Link to="/movies/811941" className="mb-1 mr-1 pr-1 text-decoration-none" style={{color: '#A5A5A5', borderRight: '1px solid rgb(127, 127, 127)' }} >Devara - Part 1</Link>
                  <Link to="/movies/1391064" className="mb-1 mr-1 pr-1 text-decoration-none" style={{color: '#A5A5A5', borderRight: '1px solid rgb(127, 127, 127)' }} >Dhaaak</Link>
                  <Link to="/movies/1184918" className="mb-1 mr-1 pr-1 text-decoration-none"style={{color: '#A5A5A5'}} >The Wild Robot</Link>
                </div>
              </div>

              {/* movie-list-2 */}
              <div className="mb-3" >
                <div className="mb-2 font-bold font-sans" style={{ color: '#A5A5A5', fontSize: '12px' }} >UPCOMMING MOVIES IN HYDERABAD</div>
                <div className="anchors-con ">
                  <Link to="/movies/1239511" className="mb-1 mr-1 pr-1 text-decoration-none" style={{color: '#A5A5A5', borderRight: '1px solid rgb(127, 127, 127)' }} >Lucky Baskhar</Link>
                  <Link to="/movies/927342" className="mb-1 mr-1 pr-1 text-decoration-none" style={{color: '#A5A5A5', borderRight: '1px solid rgb(127, 127, 127)' }} >Amaran</Link>
                  <Link to="/movies/1353436" className="mb-1 mr-1 pr-1 text-decoration-none" style={{color: '#A5A5A5', borderRight: '1px solid rgb(127, 127, 127)' }} >KA (2024)</Link>
                  <Link to="/movies/980599" className="mb-1 mr-1 pr-1 text-decoration-none" style={{color: '#A5A5A5', borderRight: '1px solid rgb(127, 127, 127)' }} >Bhool Bhulaiyaa 3</Link>
                  <Link to="/movies/912649" className="mb-1 mr-1 pr-1 text-decoration-none" style={{color: '#A5A5A5', borderRight: '1px solid rgb(127, 127, 127)' }} >Venom: The Last Dance</Link>
                  <Link to="/movies/1014214" className="mb-1 mr-1 pr-1 text-decoration-none" style={{color: '#A5A5A5', borderRight: '1px solid rgb(127, 127, 127)' }} >Singham Again</Link>
                  <Link to="/movies/777292" className="mb-1 mr-1 pr-1 text-decoration-none" style={{color: '#A5A5A5', borderRight: '1px solid rgb(127, 127, 127)' }} >Bagheera</Link>
                  <Link to="/movies/811941" className="mb-1 mr-1 pr-1 text-decoration-none" style={{color: '#A5A5A5', borderRight: '1px solid rgb(127, 127, 127)' }} >Devara - Part 1</Link>
                  <Link to="/movies/1391064" className="mb-1 mr-1 pr-1 text-decoration-none" style={{color: '#A5A5A5', borderRight: '1px solid rgb(127, 127, 127)' }} >Dhaaak</Link>
                  <Link to="/movies/1184918" className="mb-1 mr-1 pr-1 text-decoration-none"style={{color: '#A5A5A5'}} >The Wild Robot</Link>
                </div>
              </div>

              {/* movie-list-3 */}
              <div className="mb-3" >
                <div className="mb-2 font-bold font-sans" style={{ color: '#A5A5A5', fontSize: '12px' }} >MOVIES BY GENRE</div>
                <div className="anchors-con ">
                  <Link to="/movies/1239511" className="mb-1 mr-1 pr-1 text-decoration-none" style={{color: '#A5A5A5', borderRight: '1px solid rgb(127, 127, 127)' }} >Lucky Baskhar</Link>
                  <Link to="/movies/927342" className="mb-1 mr-1 pr-1 text-decoration-none" style={{color: '#A5A5A5', borderRight: '1px solid rgb(127, 127, 127)' }} >Amaran</Link>
                  <Link to="/movies/1353436" className="mb-1 mr-1 pr-1 text-decoration-none" style={{color: '#A5A5A5', borderRight: '1px solid rgb(127, 127, 127)' }} >KA (2024)</Link>
                  <Link to="/movies/980599" className="mb-1 mr-1 pr-1 text-decoration-none" style={{color: '#A5A5A5', borderRight: '1px solid rgb(127, 127, 127)' }} >Bhool Bhulaiyaa 3</Link>
                  <Link to="/movies/912649" className="mb-1 mr-1 pr-1 text-decoration-none" style={{color: '#A5A5A5', borderRight: '1px solid rgb(127, 127, 127)' }} >Venom: The Last Dance</Link>
                  <Link to="/movies/1014214" className="mb-1 mr-1 pr-1 text-decoration-none" style={{color: '#A5A5A5', borderRight: '1px solid rgb(127, 127, 127)' }} >Singham Again</Link>
                  <Link to="/movies/777292" className="mb-1 mr-1 pr-1 text-decoration-none" style={{color: '#A5A5A5', borderRight: '1px solid rgb(127, 127, 127)' }} >Bagheera</Link>
                  <Link to="/movies/811941" className="mb-1 mr-1 pr-1 text-decoration-none" style={{color: '#A5A5A5', borderRight: '1px solid rgb(127, 127, 127)' }} >Devara - Part 1</Link>
                  <Link to="/movies/1391064" className="mb-1 mr-1 pr-1 text-decoration-none" style={{color: '#A5A5A5', borderRight: '1px solid rgb(127, 127, 127)' }} >Dhaaak</Link>
                  <Link to="/movies/1184918" className="mb-1 mr-1 pr-1 text-decoration-none"style={{color: '#A5A5A5'}} >The Wild Robot</Link>
                </div>
              </div>
            </div>
          </div>
          <Foot/>
        </div>
      </footer>

    </>
  );
}

export default Footer;