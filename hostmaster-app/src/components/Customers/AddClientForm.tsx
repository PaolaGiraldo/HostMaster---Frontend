import React from "react";
import { useForm } from "react-hook-form";
import { Button, Form } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";
import { createClient } from "../../Services/serviceService";

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
    formState: { errors },
  } = useForm<IClientForm>();

  const mutation = useMutation(createClient, {
    onSuccess: () => {
      alert("Cliente agregado exitosamente");
      // Aquí podrías también redirigir o resetear el formulario.
    },
    onError: (error) => {
      alert("Hubo un error al agregar el cliente: " + error.message);
    },
  });

  const onSubmit = (data: IClientForm) => {
    mutation.mutate(data);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group controlId="username">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          {...register("username", {
            required: "El nombre de usuario es obligatorio",
          })}
          isInvalid={!!errors.username}
        />
        <Form.Control.Feedback type="invalid">
          {errors.username?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          {...register("email", { required: "El email es obligatorio" })}
          isInvalid={!!errors.email}
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
        />
        <Form.Control.Feedback type="invalid">
          {errors.documentNumber?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Button type="submit" variant="primary" disabled={mutation.isLoading}>
        {mutation.isLoading ? "Agregando..." : "Agregar Cliente"}
      </Button>
    </Form>
  );
};

export default AddClientForm;
