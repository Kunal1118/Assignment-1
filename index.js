// Order class (was in Order.js)
class Order {
  constructor(sFrom) {
      this.OrderState = {
          WELCOMING: () => {
              let aReturn = [];
              this.stateCur = this.OrderState.SIZE;
              aReturn.push("Welcome to Kunal's Juice Bar!");
              aReturn.push("We have Mango Juice and Apple Juice.");
              aReturn.push("What would you like to order?");
              return aReturn;
          },
          SIZE: (sInput) => {
              let aReturn = [];
              this.juiceType = sInput.trim().toLowerCase();
              if (this.juiceType === "mango juice" || this.juiceType === "apple juice") {
                  this.stateCur = this.OrderState.ICE;
                  aReturn.push("What size would you like? (Small, Medium, Large)");
              } else {
                  aReturn.push("Sorry, we only have Mango Juice and Apple Juice.");
                  aReturn.push("Please choose one of them.");
              }
              return aReturn;
          },
          ICE: (sInput) => {
              let aReturn = [];
              this.size = sInput.trim().toLowerCase();
              if (this.size === "small" || this.size === "medium" || this.size === "large") {
                  this.stateCur = this.OrderState.UPSELL;
                  aReturn.push("Would you like it with ice or without ice?");
              } else {
                  aReturn.push("Please choose a valid size: Small, Medium, or Large.");
              }
              return aReturn;
          },
          UPSELL: (sInput) => {
              let aReturn = [];
              this.ice = sInput.trim().toLowerCase();
              if (this.ice === "with ice" || this.ice === "without ice") {
                  this.stateCur = this.OrderState.CONFIRMATION;
                  aReturn.push("Would you like to add a bottle of water for just $1? (Yes/No)");
              } else {
                  aReturn.push("Please specify if you want it 'with ice' or 'without ice'.");
              }
              return aReturn;
          },
          CONFIRMATION: (sInput) => {
              let aReturn = [];
              this.upsell = sInput.trim().toLowerCase();
              if (this.upsell === "yes") {
                  aReturn.push("Great! A bottle of water has been added to your order.");
              } else if (this.upsell === "no") {
                  aReturn.push("No problem! Your order is just the juice.");
              } else {
                  aReturn.push("Please answer with 'Yes' or 'No'.");
                  return aReturn;
              }
              this.isDone = true;
              aReturn.push("Thank you for your order!");
              aReturn.push(`You ordered a ${this.size} ${this.juiceType} ${this.ice}.`);
              if (this.upsell === "yes") {
                  aReturn.push("And you added a bottle of water.");
              }
              aReturn.push("Please pick it up at 123 Tidy St., Acton.");
              return aReturn;
          }
      };

      this.stateCur = this.OrderState.WELCOMING;
      this.isDone = false;
      this.sFrom = sFrom;
  }

  handleInput(sInput) {
      return this.stateCur(sInput);
  }

  isDone() {
      return this.isDone;
  }
}

// Chat component (was in index.js)
class Chat extends HTMLElement {
  constructor(){
    super();
    this.oOrder = new Order("123-456-7891");
  }
  sendMessage(evt) {
    evt.preventDefault();
    var msg = this.input.value;
    this.input.value = ''
    this.writeLine(msg)
  }
  addMessage(e) {
    var msg = e.data ? JSON.parse(e.data) : e;
    this.writeLine(`${msg.FROM}: ${msg.MESSAGE}`)
  }
  writeLine(text) {
    this.messages.insertAdjacentHTML("beforeend", `<li class="message-item item-secondary">You say: ${text}</li>`);
    const aMessages = this.oOrder.handleInput(text);
    if(this.oOrder.isDone){
      this.oOrder = new Order("456-789-1023")
    }
    for(let message of aMessages){
      this.messages.insertAdjacentHTML("beforeend", `<li class="message-item item-primary">Bot says: ${message}</li>`);
    }
    this.messages.scrollTop = this.messages.scrollHeight;
  }
  connectedCallback() {
    const suffix = (Math.random()*100).toFixed().toString();
    this.innerHTML = `
        <style>

.chat${suffix} ul { list-style: none; } 

.chat${suffix} {
  max-width: 400px;
  min-height: 400px;
  background-color: #fff; 
  padding-right: 15px;
  padding-left: 15px;
  border-radius: 1rem;
}

.chat${suffix} .messages {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 500px;
}

.chat${suffix} .message-list {
  overflow-y: auto;
  max-height: 500px;
}

.chat${suffix} .message-item {
  padding: 20px;
  border-radius: 0.75rem;
  margin: 20px 0;
}

.chat${suffix} .message-item:last-child {
  margin-bottom: 0;
}

.chat${suffix} .item-primary {
  background-color: #f6f7f8;
  color: #3c3c3e;
  margin-right: 2em;
}

.chat${suffix} .item-secondary {
  background-color: #5ccad7;
  color: #fff;
  margin-left: 2em;
}

.chat${suffix} .message-input {
  display: flex;
  padding: 20px 0;
}

.chat${suffix} .message-input input {
  width: 100%;
  padding: 10px;
  border-radius: 2rem;
  border: 1px solid #a5a5a5;
}

.chat${suffix} .message-input button {
  padding: 10px;
  margin-left: 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}        
        </style>
          <div class="chat${suffix}">
    <div class="messages">
      <ul class="message-list">
      </ul>
      <form class="message-input">
        <input type="text" placeholder="Type your message..." />
        <button type="submit" class="btn">Send</button>
      </form>
    </div>
  </div>
        `;
    this.input = this.querySelector("input");
    this.messages = this.querySelector(".message-list");
    this.querySelector("form").addEventListener('submit', this.sendMessage.bind(this));
  }
}

customElements.define("x-chat", Chat);
