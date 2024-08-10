import { cookies } from "next/headers";
import ProductAddForm from "../_components/product-add-form";

export default async function ProductPage() {
	const cookieStore = cookies();
	const dataCookie = cookieStore.get("sessionToken");

	return (
		<div>
			<h4 className="text-2xl font-semibold text-center">Add Product</h4>
			<div className="flex justify-center">
				<ProductAddForm />
			</div>
		</div>
	);
}
