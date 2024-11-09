let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  touchMoveX = 0;
  touchMoveY = 0;
  touchEndX = 0;
  touchEndY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Mouse drag for desktop
    paper.addEventListener('mousedown', (e) => this.onDragStart(e, paper));
    document.addEventListener('mousemove', (e) => this.onDragMove(e, paper));
    document.addEventListener('mouseup', () => this.onDragEnd());

    // Touch drag for mobile
    paper.addEventListener('touchstart', (e) => this.onTouchStart(e, paper));
    paper.addEventListener('touchmove', (e) => this.onTouchMove(e, paper));
    paper.addEventListener('touchend', () => this.onTouchEnd(paper));
  }

  onDragStart(e, paper) {
    this.holdingPaper = true;
    paper.style.zIndex = highestZ++;
    this.touchStartX = e.clientX;
    this.touchStartY = e.clientY;
    this.prevTouchX = e.clientX;
    this.prevTouchY = e.clientY;
  }

  onDragMove(e, paper) {
    if (!this.holdingPaper) return;
    this.touchMoveX = e.clientX;
    this.touchMoveY = e.clientY;
    this.updatePaperPosition(paper);
  }

  onDragEnd() {
    this.holdingPaper = false;
  }

  onTouchStart(e, paper) {
    if (e.touches.length === 1) { // Single finger drag
      this.holdingPaper = true;
      paper.style.zIndex = highestZ++;
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.prevTouchX = this.touchStartX;
      this.prevTouchY = this.touchStartY;
    } else if (e.touches.length === 2) { // Two-finger rotate
      this.rotating = true;
    }
  }

  onTouchMove(e, paper) {
    if (this.holdingPaper && e.touches.length === 1) { // Dragging
      e.preventDefault(); // Prevents page scrolling while dragging
      this.touchMoveX = e.touches[0].clientX;
      this.touchMoveY = e.touches[0].clientY;
      this.updatePaperPosition(paper);
    } else if (this.rotating && e.touches.length === 2) { // Rotating
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const deltaX = touch2.clientX - touch1.clientX;
      const deltaY = touch2.clientY - touch1.clientY;
      const angle = Math.atan2(deltaY, deltaX);
      this.rotation = (angle * 180) / Math.PI;
      paper.style.transform = `translate(${this.currentPaperX}px, ${this.currentPaperY}px) rotate(${this.rotation}deg)`;
    }
  }

  onTouchEnd() {
    this.holdingPaper = false;
    this.rotating = false;
  }

  updatePaperPosition(paper) {
    // Calculate the change in position
    this.velX = this.touchMoveX - this.prevTouchX;
    this.velY = this.touchMoveY - this.prevTouchY;

    // Update the current position of the paper
    this.currentPaperX += this.velX;
    this.currentPaperY += this.velY;

    // Update paper style to reflect new position and rotation
    paper.style.transform = `translate(${this.currentPaperX}px, ${this.currentPaperY}px) rotate(${this.rotation}deg)`;

    // Update previous position for next frame
    this.prevTouchX = this.touchMoveX;
    this.prevTouchY = this.touchMoveY;
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
