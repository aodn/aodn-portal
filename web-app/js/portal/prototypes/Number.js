Number.prototype.toDecimalString = function() {
	return this.toString().contains('.') ? this.toString() : this + '.0';
}
