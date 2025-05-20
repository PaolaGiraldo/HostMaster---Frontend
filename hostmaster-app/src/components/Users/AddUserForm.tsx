import React from "react";
import { useForm } from "react-hook-form";
import { Button, Form } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";
import { createUser } from "../../Services/userService";
import { User } from "../../interfaces/userInterface";

interface IClientForm {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  documentNumber: string;
}

const AddClientForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IClientForm>();

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      alert("Cliente agregado exitosamente");
      reset(); // Resetea el formulario
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      alert("Hubo un error al agregar el cliente: " + errorMessage);
    },
  });

  const onSubmit = (data: IClientForm) => {
    const user: User = {
      username: data.username,
      email: data.email,
      password: "defaultPassword123", // O pide este campo en el formulario
      full_name: `${data.firstName} ${data.lastName}`,
      role: "client", // O el rol que corresponda
      firstname: data.firstName,
      lastname: data.lastName,
      document_number: data.documentNumber,
      phone_number: "", // Si no lo tienes, puedes dejarlo vacío o eliminarlo si es opcional
      reviews: [],
    };

    mutation.mutate(user);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Form.Group controlId="username">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          {...register("username", {
            required: "El nombre de usuario es obligatorio",
          })}
          isInvalid={!!errors.username}
          aria-invalid={!!errors.username}
        />
        <Form.Control.Feedback type="invalid">
          {errors.username?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          {...register("email", {
            required: "El email es obligatorio",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Formato de email inválido",
            },
          })}
          isInvalid={!!errors.email}
          aria-invalid={!!errors.email}
        />
        <Form.Control.Feedback type="invalid">
          {errors.email?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="firstName">
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          type="text"
          {...register("firstName", { required: "El nombre es obligatorio" })}
          isInvalid={!!errors.firstName}
          aria-invalid={!!errors.firstName}
        />
        <Form.Control.Feedback type="invalid">
          {errors.firstName?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="lastName">
        <Form.Label>Apellido</Form.Label>
        <Form.Control
          type="text"
          {...register("lastName", { required: "El apellido es obligatorio" })}
          isInvalid={!!errors.lastName}
          aria-invalid={!!errors.lastName}
        />
        <Form.Control.Feedback type="invalid">
          {errors.lastName?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="documentNumber">
        <Form.Label>Número de Documento</Form.Label>
        <Form.Control
          type="text"
          {...register("documentNumber", {
            required: "El número de documento es obligatorio",
          })}
          isInvalid={!!errors.documentNumber}
          aria-invalid={!!errors.documentNumber}
        />
        <Form.Control.Feedback type="invalid">
          {errors.documentNumber?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Button type="submit" variant="primary" disabled={mutation.isPending}>
        {mutation.isPending ? "Agregando..." : "Agregar Cliente"}
      </Button>
    </Form>
  );
};

export default AddClientForm;
