import './Footer.css';

export function Footer() {
  const handleCallRequest = () => {
    alert('Заказать звонок: +8 (800) 555 35 35');
  };

  return (
    <footer className='footer' id="contacts">
      <div className='divg'>
        <div className='dsa'>
          <img src="https://basemotors-api.onrender.com/images/logo.svg" alt="BaseMotors" />
          <p>© BaseMotors, 2025 <br /> Все права защищены</p>
        </div>
        <div>
          <h3>Контакты</h3>
          <p>
            <a href="tel:+88005553535" style={{ textDecoration: 'none', color: 'inherit' }}>
              +8 (800) 555 35 35
            </a>
          </p>
          <p onClick={handleCallRequest} style={{ cursor: 'pointer' }}>
            Заказать звонок
          </p>
          <p>
            <a href="mailto:basemotors@mail.ru" style={{ textDecoration: 'none', color: 'inherit' }}>
              basemotors@mail.ru
            </a>
          </p>
        </div>
        <div>
          <h3>Мы в соц сетях</h3>
          <div className='social-icons'>
            <img className='img-social1' src="https://basemotors-api.onrender.com/images/Youtube_logo.png" alt="" />
            <img className='img-social2' src="https://basemotors-api.onrender.com/images/VK.com-logo.svg" alt="" />
            <img className='img-social3' src="https://basemotors-api.onrender.com/images/Telegram_2019_Logo.svg.png" alt="" />
          </div>
        </div>
        <div>
          <h3>Принимаем к оплате</h3>
          <div className='payment-icons'>
            <img className='img-social4' src="https://basemotors-api.onrender.com/images/Visa_Inc._logo_(2021–present).svg.png" alt="" />
            <img className='img-social5' src="https://basemotors-api.onrender.com/images/Mir-logo.SVG.svg.png" alt="" />
            <img className='img-social6' src="https://basemotors-api.onrender.com/images/Mastercard-logo.svg.png" alt="" />
          </div>
        </div>
      </div>
      <p className='la'>
        Вся представленная на сайте информация носит информационный характер и не является публичной офертой, 
        определяемой положениями ст. 437 (2) ГК РФ. Для получения подробной информации обращайтесь в наши автосалоны. 
        Опубликованная на данном сайте информация может быть изменена в любое время без предварительного уведомления.
      </p>
    </footer>
  );
}