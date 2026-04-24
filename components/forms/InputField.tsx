import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    FieldError,
    FieldValues,
    Path,
    RegisterOptions,
    UseFormRegister,
} from "react-hook-form";

interface InputFieldProps<TFieldValues extends FieldValues = FieldValues> {
    name: Path<TFieldValues>;
    label: string;
    placeholder: string;
    type?: string;
    register: UseFormRegister<TFieldValues>;
    error?: FieldError;
    validation?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
}

const InputField = <TFieldValues extends FieldValues = FieldValues>({
    name,
    label,
    placeholder,
    type = "text",
    register,
    error,
    validation,
}: InputFieldProps<TFieldValues>) => {
    return (
        <div className="space-y-2">
            <Label htmlFor={name} className="form-label">{label}</Label>
            <Input
                id={name}
                type={type}
                placeholder={placeholder}
                className="form-input"
                {...register(name, validation)}
            />
            {error && <p className="text-sm text-red-500">{error.message}</p>}
        </div>
    );
};

export default InputField;