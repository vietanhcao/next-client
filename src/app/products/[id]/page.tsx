import { cookies } from "next/headers";
import productApiRequest from "../../../apiRequest/api.product";
import { handleErrorApi } from "../../../lib/utils";
import ProductAddForm from "../_components/product-add-form";

export default async function EditPage({ params }: { params: { id: string } }) {
	let product = null;
	try {
		const id = params.id;
		const res = await productApiRequest.getDetail(Number(id));
		product = res.payload.data;
	} catch (error) {
		console.log("🚀 ~ EditPage ~ error:", error);
		// handleErrorApi({ error });
	}

	if (!product) {
		return <div>Product not found</div>;
	}
  
	return (
		<div>
			<ProductAddForm product={product} />
		</div>
	);
}
