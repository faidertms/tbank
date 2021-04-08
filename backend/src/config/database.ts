import Knex from "knex";
const knexconfig = require("../../knexfile");
import { Model } from "objection";
const knex = Knex(knexconfig);
Model.knex(knex);
export default knex;