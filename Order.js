export class Order {
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