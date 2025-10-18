// Coins system
class CoinsSystem {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!this.currentUser) {
            window.location.href = 'login.html';
            return;
        }

        this.init();
    }

    init() {
        this.updateCoinsDisplay();
        this.setupEventListeners();
    }

    updateCoinsDisplay() {
        document.getElementById('user-coins').textContent = this.currentUser.coins;
        
        // Update header coins display
        const coinsDisplay = document.getElementById('coins-display');
        if (coinsDisplay) {
            coinsDisplay.textContent = `${this.currentUser.coins} AL`;
        }
    }

    setupEventListeners() {
        // Coin packages
        const packages = {
            100: 0.10,
            1000: 1.00,
            5000: 5.00,
            10000: 10.00,
            100000: 100.00
        };

        for (const [coins, price] of Object.entries(packages)) {
            const btn = document.getElementById(`buy-${coins}`);
            if (btn) {
                btn.addEventListener('click', () => this.buyCoins(parseInt(coins), price));
            }
        }

        // Convert coins to money
        const convertBtn = document.getElementById('convert-coins');
        if (convertBtn) {
            convertBtn.addEventListener('click', () => this.convertCoins());
        }
    }

    buyCoins(amount, price) {
        if (confirm(`Buy ${amount.toLocaleString()} AL for $${price}?`)) {
            this.showPaymentModal(amount, price);
        }
    }

    showPaymentModal(amount, price) {
        const cardNumber = prompt('Enter card number (16 digits):');
        if (!cardNumber || cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
            alert('Invalid card number');
            return;
        }

        const expiry = prompt('Enter expiry date (MM/YY):');
        if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
            alert('Invalid expiry date');
            return;
        }

        const cvv = prompt('Enter CVV (3 digits):');
        if (!cvv || cvv.length !== 3 || !/^\d+$/.test(cvv)) {
            alert('Invalid CVV');
            return;
        }

        const cardName = prompt('Enter cardholder name:');
        if (!cardName) {
            alert('Please enter cardholder name');
            return;
        }

        // Simulate payment processing with validation
        if (!this.processPayment(cardNumber, expiry, cvv)) {
            alert('Payment failed: Invalid card or insufficient funds');
            return;
        }

        // Payment successful - add coins
        this.addCoinsToAccount(amount, price);
    }

    processPayment(cardNumber, expiry, cvv) {
        // Simulate payment validation
        // In real implementation, this would connect to a payment processor
        const isValidCard = cardNumber.startsWith('4') || cardNumber.startsWith('5'); // Visa or Mastercard
        const isExpiryValid = this.validateExpiry(expiry);
        const isCvvValid = cvv.length === 3;
        
        // Simulate random payment failures (10% chance)
        const isPaymentSuccessful = Math.random() > 0.1;

        return isValidCard && isExpiryValid && isCvvValid && isPaymentSuccessful;
    }

    validateExpiry(expiry) {
        const [month, year] = expiry.split('/').map(Number);
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;

        if (month < 1 || month > 12) return false;
        if (year < currentYear) return false;
        if (year === currentYear && month < currentMonth) return false;
        
        return true;
    }

    addCoinsToAccount(amount, price) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex !== -1) {
            users[userIndex].coins += amount;
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
            
            this.currentUser = users[userIndex];
            
            // Send to XMR wallet
            this.sendToXMRWallet(price);
            
            alert(`Payment successful! ${amount.toLocaleString()} AL added to your account.`);
            this.updateCoinsDisplay();
        }
    }

    sendToXMRWallet(amount) {
        // In real implementation, this would integrate with XMR payment processing
        const xmrWallet = '8BdNw5qEnoodmbzBr9SfAH9urh7JYbgRQ2C9j2Sg3STj4KcTkNkE6sJXgKsgY9wAyV6jSNpPYjGNKJ4NHD2jvSBUGC1DMkY';
        console.log(`💰 Payment of $${amount} sent to XMR wallet: ${xmrWallet}`);
        // Actual implementation would use XMR payment API
    }

    convertCoins() {
        const coinsToConvert = parseInt(prompt('How many coins to convert to money? (Minimum 1000 AL = $0.10)'));
        
        if (!coinsToConvert || coinsToConvert < 1000) {
            alert('Minimum conversion is 1000 AL');
            return;
        }

        if (coinsToConvert > this.currentUser.coins) {
            alert('Not enough coins');
            return;
        }

        const moneyAmount = (coinsToConvert / 10000).toFixed(2); // 10000 AL = $1.00
        
        if (confirm(`Convert ${coinsToConvert.toLocaleString()} AL to $${moneyAmount}?`)) {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.id === this.currentUser.id);
            
            if (userIndex !== -1) {
                users[userIndex].coins -= coinsToConvert;
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
                
                this.currentUser = users[userIndex];
                
                alert(`Conversion successful! $${moneyAmount} will be sent to your registered payment method.`);
                this.updateCoinsDisplay();
            }
        }
    }
}

// Initialize coins system
let coinsSystem;
document.addEventListener('DOMContentLoaded', () => {
    coinsSystem = new CoinsSystem();
});