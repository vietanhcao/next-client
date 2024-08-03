"use client";

import React, { useState } from "react";
import card from "./card.module.css";
import "./cardcustom.css";
import { cn } from "../../../lib/utils";

export default function Card() {
	const [isChange, setIsChange] = useState(false);
	return (
		<div>
			<div className={cn(isChange && card['card'])}>Card</div>
			<button onClick={() => setIsChange(!isChange)}>Change</button>
		</div>
	);
}
