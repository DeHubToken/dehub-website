export function truncateAddress(addr) {
	return `${addr.substring(0, 6)}...${addr.substring(38)}`;
}
