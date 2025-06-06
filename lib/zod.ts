import { object, string, z } from "zod";
export const loginFormSchema = object({
  email: string({required_error: 'Correo electrónico es requerido'})
  .email({message: 'Correo electrónico no es válido'})
  .min(1,"Correo electrónico es requerido"),
  password: string({required_error: 'Contraseña es requerida'})
  .min(8,"Contraseña debe tener al menos 8 caracteres"),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;


//client
export const commentSchema = object({
  text: z.string().min(1, { message: "El comentario es requerido" }),
  date: z.date(),
});

export const serverCommentSchema = z.object({
  text: z.string().min(1),
  date: z.preprocess((val) => {
    if (typeof val === "string" || val instanceof Date) {
      return new Date(val);
    }
    return val;
  }, z.date()),
});

export const preferenceSchema = object({
  language: z.string().min(1, { message: "El idioma es requerido" }).optional(),
  paid_method: z.string().min(1, { message: "El método de pago es requerido" }).optional(),
  notifications: z.boolean().optional(),
});

export const clientInfoFormSchema = object({
  comments: z.array(commentSchema).optional(),
  preferences: preferenceSchema.optional()
});

export const serverClientInfoSchema = z.object({
  comments: z.array(serverCommentSchema).optional(),
  preferences: preferenceSchema.optional(),
});

export const clientInfoSchema = clientInfoFormSchema.merge(object({
  id_client: z.number().int().positive({ message: "El id_cliente es requerido" }),
}));

export const serverInfoSchema = serverClientInfoSchema.merge(object({
  id_client: z.number().int().positive({ message: "El id_cliente es requerido" }),
}));

export const clientFormSchema = object({
  name: z.string().min(1, { message: "El nombre es requerido" }),
  email: z.string().email({ message: "El correo electrónico no es válido" }),
  phone: z.string().optional(),
  clientInfo: clientInfoFormSchema.optional()
});

export const serverFormSchema = object({
  name: z.string().min(1, { message: "El nombre es requerido" }),
  email: z.string().email({ message: "El correo electrónico no es válido" }),
  phone: z.string().optional(),
  clientInfo: serverClientInfoSchema.optional()
});

export const clientSchema = object({
  name: z.string().min(1, { message: "El nombre es requerido" }),
  email: z.string().email({ message: "El correo electrónico no es válido" }),
  phone: z.string().optional(),
  clientInfo: serverInfoSchema.optional()
});

export type ClientSchema = z.infer<typeof clientFormSchema>;

export const updateClientSchema = z.object({
  id: z.number().int().positive("El ID del cliente es obligatorio y debe ser un número positivo"),
  email: z.string().email("Debe ser un correo electrónico válido").optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  clientInfo: z
    .object({
      comments: z.array(
        z.object({
          text: z.string(),
          date: z.preprocess((val) => {
            if (typeof val === "string" || val instanceof Date) {
              return new Date(val);
            }
            return val;
          }, z.date()),
        })
      ).optional(),
      preferences: z
        .object({
          language: z.string().optional(),
          paid_method: z.string().optional(),
          notifications: z.boolean().optional(),
        })
        .optional(),
    })
    .optional(),
});

export const updatedServerSchema = z.object({
  id: z.number().int().positive("El ID del cliente es obligatorio y debe ser un número positivo"),
  email: z.string().email("Debe ser un correo electrónico válido").optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  clientInfo: z
    .object({
      comments: z.array(
        z.object({
          text: z.string(),
          date: z.date(),
        })
      ).optional(),
      preferences: z
        .object({
          language: z.string().optional(),
          paid_method: z.string().optional(),
          notifications: z.boolean().optional(),
        })
        .optional(),
    })
    .optional(),
});

export type UpdateClientSchema = z.infer<typeof updateClientSchema>;

//product
export const productFormSchema = object({
  name: z.string().min(1, { message: "El nombre es requerido" }),
  price: z.number().positive({ message: "El precio es requerido" }),
  stock: z.number().int().positive({ message: "El stock es requerido" }),
});

export const productSchema = productFormSchema.merge(
  object({
    id: z.number().int().positive({ message: "El ID del producto es requerido" }),
  })
);

export type ProductSchema = z.infer<typeof productSchema>;

export type ProductFormSchema = z.infer<typeof productFormSchema>;


export const sendOrderSchema = object({
  clientId: z.number().int().positive({ message: "El ID del cliente es obligatorio y debe ser un número positivo" }),
  total: z.number().positive({ message: "El total es obligatorio y debe ser un número positivo" }),
  items: z.array(
    z.object({
      productId: z.number().int().positive({ message: "El ID del producto es obligatorio y debe ser un número positivo" }),
      quantity: z.number().int().positive({ message: "La cantidad es obligatoria y debe ser un número positivo" }),
      subtotal: z.number().positive({ message: "El subtotal es obligatorio y debe ser un número positivo" }),
    })
  ),
})

export type SendOrderSchema = z.infer<typeof sendOrderSchema>;