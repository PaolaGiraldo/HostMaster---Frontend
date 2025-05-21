import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

type FormData = {
  name: string;
  email: string;
  phone: string;
  requestType: string;
  message: string;
};

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<FormData>();

  const { t } = useTranslation();
  const onSubmit = async (data: FormData) => {
    try {
      const result = await emailjs.send(
        "service_tq3cho9",
        "contact_es",
        {
          from_name: data.name,
          from_email: data.email,
          phone: data.phone,
          title: data.requestType,
          message: data.message,
        },
        "jvkaOskoDLO-aR3zf"
      );
      console.log("Correo enviado:", result.text);
      reset();
    } catch (error: any) {
      console.error("Error al enviar:", error);
      const msg = error?.response?.data?.detail || "Error al enviar correo";
      toast.error(msg);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-card">
        <h3 className="contact-title">{t("contact.title")}</h3>
        <p className="contact-subtitle">{t("contact.subtitle")}</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label text-white">{t("contact.name")}</label>
            <input
              type="text"
              className="form-control contact-input"
              {...register("name", { required: true })}
            />
            {errors.name && (
              <small className="text-danger">{t("contact.required")}</small>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label text-white">
              {t("contact.email")}
            </label>
            <input
              type="email"
              className="form-control contact-input"
              {...register("email", {
                required: true,
                pattern: /^\S+@\S+\.\S+$/,
              })}
              placeholder="tucorreo@ejemplo.com"
            />
            {errors.email && (
              <small className="text-danger">{t("contact.invalidEmail")}</small>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label text-white">
              {t("contact.phone")}
            </label>
            <input
              type="tel"
              className="form-control contact-input"
              {...register("phone", { required: true })}
              placeholder="+57 300 000 0000"
            />
            {errors.phone && (
              <small className="text-danger">{t("contact.required")}</small>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label text-white">
              {" "}
              {t("contact.requestType")}
            </label>
            <select
              className="form-select contact-input"
              {...register("requestType", { required: true })}
            >
              <option value="">{t("select")}</option>
              <option value="info">{t("contact.infoRequest")}</option>
              <option value="quote">{t("contact.quoteRequest")}</option>
            </select>
            {errors.requestType && (
              <small className="text-danger">{t("select")}</small>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label text-white">
              {t("contact.message")}
            </label>
            <textarea
              className="form-control contact-input"
              {...register("message", { required: true })}
              rows={4}
            ></textarea>
            {errors.message && (
              <small className="text-danger">{t("contact.required")}</small>
            )}
          </div>

          <button type="submit" className="btn btn-mint w-100">
            Enviar solicitud
          </button>

          {isSubmitSuccessful && (
            <div className="alert alert-success mt-3 text-center">
              ¡Gracias! Tu mensaje fue enviado.
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
