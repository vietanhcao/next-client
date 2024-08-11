import { cookies } from "next/headers";
import productApiRequest from "../../../../apiRequest/api.product";
import { handleErrorApi } from "../../../../lib/utils";
import ProductAddForm from "../../_components/product-add-form";
import { cache } from "react";
import { Metadata, ResolvingMetadata } from "next";

const getDetail = cache(productApiRequest.getDetail);

type Props = {
	params: { id: string };
	searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
	{ params, searchParams }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {
	let product = null;
	try {
		const id = params.id;
		const res = await getDetail(Number(id));
		product = res.payload.data;
	} catch (error) {
		console.log("🚀 ~ ProductDetailPage ~ error:", error);
	}

	// optionally access and extend (rather than replace) parent metadata
	// const previousImages = (await parent).openGraph?.images || [];

	return {
		title: product?.name,
		description: product?.description,
		// openGraph: {
		// 	images: ["/some-specific-page-image.jpg", ...previousImages],
		// },
	};
}


export default async function EditPage({
	params,
	searchParams,
}: Props) {
	let product = null;
	try {
		const id = params.id;
		const res = await getDetail(Number(id));
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
