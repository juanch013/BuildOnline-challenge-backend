import { JwtPayload } from "jsonwebtoken";

export default interface MyJwtPayload extends JwtPayload {
    id: string;
    email: string;
}