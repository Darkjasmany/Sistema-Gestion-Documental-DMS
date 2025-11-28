import type { Request, Response } from "express";
import { Module } from "src/models/Module";

export class ModulesController {
  static getModules = async (req: Request, res: Response) => {
    const list = await Module.findAll({ order: ["nombres", "ASC"] });
    res.json(list);
  };

  static createModule = async (req: Request, res: Response) => {
    const created = await Module.create(req.body);
    res.status(201).json(created);
  };
}
