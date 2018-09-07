// Create a class for the element
class PopUpInfo extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();

    // Create a shadow root
    const shadow = this.attachShadow({mode: 'open'});

    // Create spans
    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'wrapper');

    const tableOne = document.createElement('table');
    tableOne.setAttribute('class', 'tableOne');
    tableOne.setAttribute('tabindex', 0);

    const info = document.createElement('tr');
    info.setAttribute('class', 'info');

    const tableSetup = `<tr>
            <th class="ppg">ppg</th>
            <th class="ppg">rpg</th>
            <th class="ppg">apg</th>
            <th class="ppg">per</th>
        </tr>
        <tr>
            <td class="ppg" data-ppg-stephen>21.7</td>
            <td class="ppg" data-rpg-stephen>3.8</td>
            <td class="ppg" data-apg-stephen>6.7</td>
            <td class="ppg" data-per-stephen>10.5</td>
        </tr>
        <tr>
            <td colspan="4"><a href="https://www.basketball-reference.com/players/c/curryst01.html">Full Stats</a></td>
        </tr>`

    // Take attribute content and put it inside the info span
    const text = this.getAttribute('data-text');
    info.textContent = text;

    // Insert tableOne
    let imgUrl;
    if(this.hasAttribute('img')) {
      imgUrl = this.getAttribute('img');
    } else {
      imgUrl = 'img/default.png';
    }

    const img = document.createElement('img');
    img.src = imgUrl;
    tableOne.appendChild(img);

    // Create some CSS to apply to the shadow dom
    const style = document.createElement('style');
    console.log(style.isConnected);

    style.textContent = `
      .wrapper {
        position: relative;
      }
      .info {
        font-size: 0.8rem;
        width: 200px;
        display: inline-block;
        border: 1px solid black;
        padding: 10px;
        background: white;
        border-radius: 10px;
        opacity: 0;
        transition: 0.6s all;
        position: absolute;
        bottom: 20px;
        left: 10px;
        z-index: 3;
      }
      img {
        width: 1.2rem;
      }
      .tableOne:hover + .info, .tableOne:focus + .info {
        opacity: 1;
      }
    `;

    // Attach the created elements to the shadow dom
    shadow.appendChild(style);
    console.log(style.isConnected);
    shadow.appendChild(wrapper);
    wrapper.appendChild(tableOne);
    wrapper.appendChild(info);
    console.log(this)
  }
}

// Define the new element
customElements.define('popup-info', PopUpInfo);
