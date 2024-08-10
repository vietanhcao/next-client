"use client";

import { useRouter } from "next/navigation";
import productApiRequest from "../../../apiRequest/api.product";
import {
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogOverlay,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle,
	AlertDialogTrigger,
	AlertDialog,
} from "../../../components/ui/alert-dialog";
import { Button } from "../../../components/ui/button";
import { useToast } from "../../../components/ui/use-toast";
import { handleErrorApi } from "../../../lib/utils";
import { ProductResType } from "../../../schemaValidations/product.schema";

interface DeleteProductProps {
	product: ProductResType["data"];
}

export default function DeleteProduct({ product }: DeleteProductProps) {
	const { toast } = useToast();
	const router = useRouter();
	const deleteProduct = async () => {
		try {
			const res = await productApiRequest.delete(product.id);

			toast({
				title: "Delete successful",
				description: res.payload.message,
			});
			router.refresh();
		} catch (error) {
			handleErrorApi({ error });
		}
	};
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant={"destructive"}>Delete</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete{" "}
						{product.name} and remove your data from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={deleteProduct}>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
