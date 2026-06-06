import express, { Request, Response } from "express";

const router = express.Router();

router.post("/tracking", async (req: Request, res: Response) => {
  const { resi, kurir } = req.body;

  if (!resi || !kurir) {
    return res.status(400).json({ error: "Resi dan kurir wajib diisi" });
  }

  try {
    const response = await fetch("https://pro.rajaongkir.com/api/waybill", {
      method: "POST",
      headers: {
        key: process.env.RAJAONGKIR_API_KEY ?? "",
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ waybill: resi, courier: kurir }).toString(),
    });

    const data = (await response.json()) as any;

    if (data.rajaongkir.status.code !== 200) {
      return res.status(404).json({ error: "Resi tidak ditemukan" });
    }

    const result = data.rajaongkir.result;

    return res.json({
      status: result.delivery_status.status,
      description: result.delivery_status.description,
      estimasi: result.estimasi_time,
      pengirim: result.shipper_detail.name,
      penerima: result.receiver_detail.name,
      history: result.manifest.map((m: any) => ({
        tanggal: `${m.manifest_date} ${m.manifest_time}`,
        keterangan: m.manifest_description,
        kota: m.city_name,
      })),
    });
  } catch (err) {
    return res.status(500).json({ error: "Gagal menghubungi RajaOngkir" });
  }
});

export default router;
