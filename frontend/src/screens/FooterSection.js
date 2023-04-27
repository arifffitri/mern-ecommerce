import React from "react";

const FooterSection = () => {
  return (
    <div className="footer">
      <div className="sb__footer section__padding">
        <div className="sb__footer-links">
          <div className="sb__footer-links-div">
            <h4>About ZORO</h4>
            <a href="/information">
              <p>Information</p>
            </a>
            <a href="/storelocator">
              <p>Store Locator</p>
            </a>
            <a href="/careers">
              <p>Careers</p>
            </a>
          </div>
          <div className="sb__footer-links-div">
            <h4>Help</h4>
            <a href="/faq">
              <p>FAQ</p>
            </a>
            <a href="/policy">
              <p>Return & Privacy Policy</p>
            </a>
            <a href="/accessibility">
              <p>Accessibility</p>
            </a>
          </div>
          <div className="sb__footer-links-div">
            <h4>E-Newsletter</h4>
            <a href="/newsletter">
              <p>SUBSCRIBE NOW</p>
            </a>
          </div>
          <div className="sb__footer-links-div">
            <h4>Account</h4>
            <a href="/profile">
              <p>Profile</p>
            </a>
            <a href="/orderhistory">
              <p>Order History</p>
            </a>
            <a href="/signup">
              <p>Create Account</p>
            </a>
          </div>
          <div className="sb__footer-links-div">
            <div className="socialmedia">
              <p>
                <i class="fa-brands fa-square-facebook fa-2xl"></i>
              </p>
              <p>
                <i class="fa-brands fa-square-twitter fa-2xl"></i>
              </p>
              <p>
                <i class="fa-brands fa-linkedin fa-2xl"></i>
              </p>
              <p>
                <i class="fa-brands fa-square-instagram fa-2xl"></i>
              </p>
            </div>
          </div>
        </div>

        <hr></hr>

        <div className="sb__footer-below">
          <div className="sb__footer-copyright">
            <p>@{new Date().getFullYear()} Codeline. All right reserved.</p>
          </div>
          <div className="sb__footer-below-links">
            <a href="/terms">
              <div>
                <p>Terms & Conditions</p>
              </div>
            </a>
            <a href="/privacy">
              <div>
                <p>Privacy</p>
              </div>
            </a>
            <a href="/security">
              <div>
                <p>Security</p>
              </div>
            </a>
            <a href="/Cookie">
              <div>
                <p>Cookie Declaration</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterSection;
